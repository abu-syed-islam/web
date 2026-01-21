'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import NextImage from 'next/image';
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from 'lucide-react';
import { ToggleTheme } from './toggle-theme';
import { SITE_DESCRIPTION, SOCIAL_MEDIA } from '@/constants/company';
import { cn } from '@/lib/utils';
import { getLocaleFromStorage, setLocaleInStorage, getMessages, getNestedTranslation } from '@/lib/i18n';
import { NewsletterSignup } from '@/components/newsletter-signup';
import type { Locale } from '@/types/i18n';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Services',
		links: [
			{ title: 'Our Services', href: '/services' },
			{ title: 'Pricing', href: '/pricing' },
			{ title: 'Portfolio', href: '/portfolio' },
			{ title: 'Testimonials', href: '/#testimonials' },
		],
	},
	{
		label: 'Company',
		links: [
			{ title: 'About Us', href: '/about' },
			{ title: 'FAQs', href: '/faqs' },
			{ title: 'Privacy Policy', href: '/privacy' },
			{ title: 'Terms of Service', href: '/terms' },
		],
	},
	{
		label: 'Resources',
		links: [
			{ title: 'Blog', href: '/blog' },
			{ title: 'Contact', href: '/contact' },
		],
	},
	{
		label: 'Social',
		links: [
			{ title: 'Facebook', href: SOCIAL_MEDIA.facebook, icon: FacebookIcon },
			{ title: 'Instagram', href: SOCIAL_MEDIA.instagram, icon: InstagramIcon },
			{ title: 'Youtube', href: SOCIAL_MEDIA.youtube, icon: YoutubeIcon },
			{ title: 'LinkedIn', href: SOCIAL_MEDIA.linkedin, icon: LinkedinIcon },
		],
	},
];

const LANGUAGE_OPTIONS = [
	{ label: 'Bangla', value: 'bn' },
	{ label: 'English', value: 'en' },
];

export function Footer() {
	const [selectedLanguage, setSelectedLanguage] = React.useState<Locale>('en');
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
		setSelectedLanguage(getLocaleFromStorage());
	}, []);

	const handleLanguageChange = (locale: Locale) => {
		setSelectedLanguage(locale);
		setLocaleInStorage(locale);
		// Trigger a custom event that other components can listen to
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('localechange', { detail: locale }));
		}
	};

	const messages = mounted ? getMessages(selectedLanguage) : getMessages('en');
	const description = getNestedTranslation(messages, 'footer.description');

	return (
		<footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16">
			<div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

			<div className="grid w-full gap-8 xl:grid-cols-[1.5fr_1fr] xl:gap-12">
				<div className="space-y-6">
					<AnimatedContainer className="space-y-4">
						<NextImage 
							src="/logo.png" 
							alt="Flinkeo Logo" 
							width={120} 
							height={40}
							className="h-8 w-auto"
						/>
						<p className="text-muted-foreground mt-4 text-sm leading-relaxed">
							{mounted ? description : SITE_DESCRIPTION}
						</p>
					</AnimatedContainer>
					<AnimatedContainer delay={0.2}>
						<NewsletterSignup variant="compact" />
					</AnimatedContainer>
				</div>

				<div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-1 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-xs">{section.label}</h3>
								<ul className="text-muted-foreground mt-4 space-y-2 text-sm">
									{section.links.map((link) => (
										<li key={link.title}>
											<a
												href={link.href}
												className="hover:text-foreground inline-flex items-center transition-all duration-300"
											>
												{link.icon && <link.icon className="me-1 size-4" />}
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>

			{/* Bottom row with copyright, theme and language buttons */}
			<div className="mt-8 flex w-full flex-col items-start justify-between gap-4 border-t border-border/50 pt-6 md:flex-row md:items-center">
				<p className="text-muted-foreground text-sm">
					© {new Date().getFullYear()} Flinkeo. All rights reserved.
				</p>
				<div className="flex items-center gap-3">
					<ToggleTheme />
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3 }}
						className="bg-muted/80 inline-flex items-center overflow-hidden rounded-md border border-border"
						role="radiogroup"
					>
						{LANGUAGE_OPTIONS.map((option) => (
							<button
								key={option.value}
								className={cn(
									'relative flex h-7 cursor-pointer items-center justify-center rounded-md px-3 text-xs transition-all',
									selectedLanguage === option.value
										? 'text-foreground'
										: 'text-muted-foreground hover:text-foreground',
								)}
								role="radio"
								aria-checked={selectedLanguage === option.value}
								aria-label={`Switch to ${option.label}`}
								onClick={() => handleLanguageChange(option.value as Locale)}
							>
								{selectedLanguage === option.value && (
									<motion.div
										layoutId="language-option"
										transition={{ type: 'spring', bounce: 0.1, duration: 0.75 }}
										className="border-muted-foreground/50 absolute inset-0 rounded-md border"
									/>
								)}
								<span className="relative z-10">{option.label}</span>
							</button>
						))}
					</motion.div>
				</div>
			</div>
		</footer>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
